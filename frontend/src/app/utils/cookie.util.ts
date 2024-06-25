export class CookieUtil {
  static getCookie(name: string): string | undefined {
    const value: string = `; ${document.cookie}`;
    const parts: string[] | undefined = value?.split(`; ${name}=`);
    if (parts && parts.length === 2) {
      return (parts as any).pop().split(';').shift();
    }
    return undefined;
  }

  static deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
