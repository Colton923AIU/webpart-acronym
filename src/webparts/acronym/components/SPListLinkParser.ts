const SPListLinkParser = (link:string)=>{
    console.log('parsing: ', link)
    let parsed = link
    const parts = parsed.split('/')[parsed.split('/').indexOf('Lists') + 1]
    if (!parts) return null
    console.log('parsed: ', parts.replace(/%20/g,' ').split('?')[0])
    console.log(parts.replace(/%20/g,' ').split('?')[0])
    console.log(parts.replace(/%20/g,' ').split('?')[0].trim())
    return parts.replace(/%20/g,' ').split('?')[0]
}

export default SPListLinkParser