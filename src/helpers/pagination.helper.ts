export const pageValues = (query: any) => {
  const limit = query.limit ? parseInt(query.limit) : 10;
  const page = query.page ? parseInt(query.page) : 1;
  const skip = page == 1 ? 0 : limit * page - limit;

  return { page, limit, skip };
};
export const pageResponse = (items: any, page: any, limit: any, total: any) => {
  total = total ? total : 0;
  const pages = limit == 0 ? 1 : Math.ceil(total / limit);
  return {
    items,
    page,
    limit,
    pages: pages ? pages : 0,
    total,
  };
};
export const aggregatePage = (page: any, limit: any, skip: any) => ({
  $facet: {
    metadata: [{ $count: "total" }, { $addFields: { page } }],
    data: [{ $skip: skip }, ...(limit ? [{ $limit: limit }] : [])],
  },
});
export const paginate = (array: any, page: any, limit: any) => {
  return array ? array.slice(page * limit, page * limit + limit) : [];
};
