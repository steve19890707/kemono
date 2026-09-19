export const getGameLink = ({ domain, inside, param, locale }) => {
    let normalLink
    let featureLink
    const lang = locale === 'cn' ? 'zh-cn' : locale
  
    if (inside) {
      const isParamHasProtocal = param && param.includes('http')
      normalLink = isParamHasProtocal
        ? param
        : `${domain}${param ? `${param}&language=${lang}` : `?language=${lang}&token=guest123`}`
      featureLink = isParamHasProtocal
        ? param
        : `${domain}${param || `?language=${lang}&token=guest`}`
    } else {
      normalLink = `${domain}/${param}`
    }
    return { normalLink, featureLink }
  }
  