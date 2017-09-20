import { Observable } from 'rxjs';

export default function(url, method = 'GET', config = {}) {
  return Observable.ajax(
    Object.assign(
      {
        url,
        method,
      },
      config
    )
  );
}
