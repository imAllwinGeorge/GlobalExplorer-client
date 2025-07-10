export interface SignupDTO {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string
}

export interface LoginDTO {
    email: string,
    password: string
}

export interface HostSignupDTO {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string,
  kyc_idProof: File | null,
  kyc_addressProof: File | null,
  kyc_panCard: File | null,
  accountHolderName: string,
  accountNumber: string,
  branch: string,
  ifsc: string,
  registrationCertificate: File | null,
  safetyCertificate: File | null,
  insurance: File | null,
  license: File | null,
}

export interface ActivityDTO {
  activityName: string;
  itenary: string;
  maxCapacity: number;
  categoryId: string;
  pricePerHead: number;
  userId: string;
  street: string;
  city: string;
  district: string;
  state: string;
  postalCode: string;
  country: string;
  location: [number, number];
  images: File[];
  reportingPlace: string;
  reportingTime: string;
}


export interface BlogDTO {
  userId: string;
  title: string;
  author: string;
  introduction: string;
  sections: {
    sectionTitle: string;
    content: string;
    image?: File | string;
  }[];
  image: File | string;
}
