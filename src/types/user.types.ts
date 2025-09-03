export type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_image: string | null;
    org_id: number | null;
    created_by: number | null;
    metaData: any | null;
    createdAt: string;
    updatedAt: string;
};

export type Signup = Omit<User, 'id' | 'profile_image' | 'org_id' | 'created_by' | 'metaData' | 'createdAt' | 'updatedAt'>;

export type Login = {
    email: string;
    password: string;
};
  