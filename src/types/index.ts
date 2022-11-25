interface ClientProps {
  name: string;
  document: string;
  phone: string;
  email: string;
  street: string;
  number: string;
  comp: string;
  district: string;
  cep: string;
  city: string;
  user: string;
  password: string;
  state: string;
}

interface LoginProps {
  user: string;
  password: string;
}

interface UploaderProps {
  id: string;
  destiny: "CATEGORY" | "PRODUCT" | "MODELING" | "TABLES" | "CATALOG";
}

interface CategoryStoreProps {
  name: string;
  description?: string;
}

export type { ClientProps, LoginProps, UploaderProps, CategoryStoreProps };
