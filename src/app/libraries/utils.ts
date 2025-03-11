export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    "MOBILESHOP_STORE_DOMAIN",
    "MOBILESHOP_STOREFRONT_ACCESS_TOKEN",
  ];
  const missingEnvironmentVariables = [] as string[];
  requiredEnvironmentVariables.forEach((envVar) => {
    if(!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  })
  // cần notify để biết những môi trường nào chưa được thêm vào
  if(missingEnvironmentVariables.length) {
    throw new Error("The following environment variables are missing. Your site will not work without them.")
  }
  if(process.env.MOBILESHOP_STORE_DOMAIN?.includes('[') || process.env.MOBILESHOP_STORE_DOMAIN?.includes(']')) {
    throw new Error("Your `MOBILESHOP_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.")
  }
};

/**
 * Kiểm tra chuỗi có bắt đầu với ký tự startWith hay không
 * @param stringToCheck
 * @param startWith 
 * @returns 
 */
export const ensureStartsWith = (stringToCheck:string, startWith:string) => 
  stringToCheck.startsWith(startWith) ? stringToCheck : `${startWith}${stringToCheck}`;

