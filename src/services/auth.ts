
import { apiCall } from '@/lib/apiUtils';
import { Signup, Login } from '@/types/user.types';

export async function signup(data:Signup) {
  return apiCall<Signup[]>('/auth/register',{body: data, method: 'POST'});
}
export async function login(data:Login) {
  return apiCall<Signup[]>('/auth/login',{body: data, method: 'POST'});
}

