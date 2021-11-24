const tablet = new RegExp(/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i);
const mobile = new RegExp(
  /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/,
);

export enum DeviceType {
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  DESKTOP = 'DESKTOP',
}

export function getDeviceType() {
  const { userAgent } = navigator;

  if (tablet.test(userAgent)) {
    return DeviceType.TABLET;
  }

  if (mobile.test(userAgent)) {
    return DeviceType.MOBILE;
  }

  return DeviceType.DESKTOP;
}
