export interface ISale {
  salePersonId: string;
  investorName: string;
  investorCNIC: string;
  investorDistrict: string;
  investorPhone: string;
  investorFatherName: string;
  investorBankName: string;
  investorAccountTitile: string;
  investorAccountNumber: string;
  NextOfKin: string;
  NextOfKinPhone: string;
  NextOfKinCnic: string;
  currency: string;
  totalAmount: string;
  continuity: boolean;
  amountRecieved: string;
  tenure: string;
  natureofAgrement: string;
  bonusAdjusted: boolean;
  bonusPhoneNo: string;
  bonusAccountBankName: string;
  bonusAccountNumber: string;
  bonusAccountTitle: string;
  returnDay: string;
  status: {
    fiance: boolean;
    cpu: boolean;
    cmd: boolean;
  };
}

export interface ICMD {
  email: string;
  password: string;
}

export interface ICPU {
  email: string;
  password: string;
}

export interface IFinance {
  email: string;
  password: string;
}

export interface ISalePerson {
  salePersonName: string;
  salePersonEmail: string;
  salePersonPhone: string;
  salePersonCnic: string;
  password: string;
}

export enum SaleStatus {
  PENDING = "Pending",
  PAID = "Paid",
  REJECTED = "Rejected",
}

export interface IReturns {
  saleId: string; 
  date: Date;
  status: SaleStatus;
  returnAmount: string;
}
