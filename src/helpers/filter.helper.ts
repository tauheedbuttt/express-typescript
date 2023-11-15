import mongoose, { Model } from "mongoose";
import { pageValues, aggregatePage, pageResponse } from "./pagination.helper";

export const filterOptions = (options: any, collection: any) => {
  const filter: any = {};
  Object.keys(options).forEach((key) => {
    const value = options[key];
    if (value == null || value == undefined) return;

    if (key == "search") {
      if (!value?.value) return;
      filter["$or"] = [{ id: { $regex: value.value, $options: "i" } }];
      value.fields.forEach((field: any) => {
        if (field == "-id") {
          filter["$or"] = filter["$or"].filter((item: any) => !item.id);
          return;
        }
        const temp: any = {};
        const type = collection.prototype.schema.obj[field]?.type;
        const number = isNaN(value.value) ? "" : Number(value.value);
        temp[field] =
          type && typeof type() == "number"
            ? number
            : { $regex: value.value, $options: "i" };
        filter["$or"].push(temp);
      });
    } else if (key == "range") {
      if (value?.min || value?.max) {
        filter[value.field] = {
          ...(value.min ? { $gte: parseInt(value.min) } : {}),
          ...(value.max ? { $lte: parseInt(value.max) } : {}),
        };
      }
    } else if (key == "date") {
      const iso = value.value;
      if (!iso) return;

      const start = new Date(iso);
      start.setUTCHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      start.setUTCHours(0, 0, 0, 0);

      const greater: any = {};
      const lesser: any = {};

      greater[value.field] = { $gte: start };
      lesser[value.field] = { $lt: end };

      filter["$and"] = [greater, lesser];
    } else filter[key] = value;
  });
  return filter;
};
export const uniqueQuery = (unique: any) => {
  const query = unique
    .map((item: any) => {
      if (!item.value) return null;
      const query: any = {};
      query[`${item.field}`] = item.value;
      return query;
    })
    .filter((item: any) => item);

  const message = `Account already exists for this ${unique
    .filter((item: any) => item.value)
    .map((item: any) => item.field)
    .join("/")}`;

  return {
    query: query.length == 0 ? {} : { $or: query },
    message,
  };
};
export const mongoID = (id: any) => {
  return mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : undefined;
};

export const aggregate = async (model: any, options: any) => {
  const filter = filterOptions(options.filter, model);
  const { page, limit, skip } = pageValues(options.pagination);
  const response = await model.aggregate([
    ...(options.pipeline ? options.pipeline : []),
    {
      $match: { ...filter, deleted: filter.deleted ? filter.deleted : false },
    },
    {
      $sort: { _id: -1 },
    },
    aggregatePage(page, limit, skip),
  ]);

  const data = response[0].data;
  const count = response[0].metadata[0]?.total;

  return pageResponse(data, page, limit, count);
};
