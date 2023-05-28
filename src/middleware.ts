import { PASSWORD } from './config';

export function requirePassword(req, _res, next) {
  const password = req.body.password;

  if (!password) {
    return next(new Error('password is required'));
  }

  if (password !== PASSWORD) {
    return next(new Error('password is incorrect'));
  }
  
  return next();
}
