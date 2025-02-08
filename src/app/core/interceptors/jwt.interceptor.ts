import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, EMPTY, switchMap, tap, throwError } from 'rxjs';
import { LoginService } from '../../features/layout/services/login.service';
import { StorageService } from '../services/storage.service';
import { SystemStorageKey } from '../enums/system-storage.enum';
import { Router } from '@angular/router';
import { SystemMessageService } from '../services/system-message.service';

/**
 * JWT 攔截器
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const storageService = inject(StorageService);
  const router = inject(Router);
  const messageService = inject(SystemMessageService);

  // return next(req);
  console.log('攔截請求' + req.url);

  // 如果是 refreshToken API，直接放行請求
  if (req.url.includes('/api/v1/refresh')) {
    console.log('refreshToken API，直接放行請求');
    return next(req);
  }

  return authService.getJwtToken().pipe(
    // 展平處理非同步流，確保非同步取得的 token 可以被處理，並用於後續請求的加工。
    switchMap((token) => {
      // 若 Token 過期，執行 refresh token
      if (authService.checkExpired(token)) {
        console.log('Token 過期，透過 refreshToken 更新既有的 Token');
        const refreshToken =
          storageService.getLocalStorageItem(SystemStorageKey.REFRESH_TOKEN) ||
          '';
        console.log(refreshToken);

        if (refreshToken) {
          authService.refreshToken(refreshToken).subscribe({
            next: (res) => {
              console.log('刷新 Token 成功!');
              storageService.setLocalStorageItem(
                SystemStorageKey.JWT_TOKEN,
                res?.token
              );
              storageService.setSessionStorageItem(
                SystemStorageKey.JWT_TOKEN,
                res?.token
              );
              storageService.setLocalStorageItem(
                SystemStorageKey.REFRESH_TOKEN,
                res?.refreshToken
              );
              storageService.setSessionStorageItem(
                SystemStorageKey.REFRESH_TOKEN,
                res?.refreshToken
              );
            },
            error: (err) => {
              console.log('刷新失敗', err);
              messageService.error('Token 過期，請重新登入');
              setTimeout(() => {
                // 目前 外部 AuthService 無刷新機制
                router.navigateByUrl('/login');
              }, 500);
            },
          });
        }
      }

      // 如果有 Token，將其附加到 Header
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // 繼續處理請求
      return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          if (error.status === 500) {
            console.error('伺服器錯誤:', error.message);
          } else if (error.status === 401) {
            messageService.error('JWT 過期，重新導向至登入頁');
            setTimeout(() => {
              console.warn('JWT 過期，重新導向至登入頁');
              localStorage.removeItem('token'); // 清除過期 Token
              router.navigate(['/login']); // 導向登入頁
            }, 1000);
          } else {
            // 根據需要通知用戶
            console.error('其他錯誤:', error.message);
          }

          // 返回 EMPTY 或重新導向
          return EMPTY;
        })
      );
    })
  );
};

// (res) => {
//   console.log('刷新 Token 成功!');
//   storageService.setLocalStorageItem(SystemStorageKey.JWT_TOKEN, res?.token);
//   storageService.setSessionStorageItem(SystemStorageKey.JWT_TOKEN, res?.token);
// };
