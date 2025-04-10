export type Roles = 'mate' | 'host' | 'inmate' | 'superadmin' | 'user' | 'mates';

export type Permissions = {
    [key: string]: string[];
  };
  

 export type CustomMessages = {
    [key: string]: { [key: string]: string };
  };
