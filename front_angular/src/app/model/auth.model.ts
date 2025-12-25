
export interface AuthCredentials {
  username : string
  password : string
}
export interface GetTokent {
  access : string,
  refresh :string

}
export interface Article{
id?: number;
title: string;
content: string;
image: string;
category: string;
tag: string;
is_published: boolean;
}
export interface Category{
  id: number;
  name: string;
  slug: string;
}
export interface Tag {
  id: number;
  name: string;
  slug: string;
}