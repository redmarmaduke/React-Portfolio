/**
 * https://tools.ietf.org/html/rfc3986
 * 
 * @param String str 
 * @returns Object {
 *   scheme?
 *   authority?
 *   path?
 *   query?
 *   fragment?
 * }}
 */
export default function parseUri(str) {
    let keys = [ '', '', 'scheme', '', 'authority', 'path', '', 'query', '', 'fragment'];
    let m = (/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/.exec(str));
    let q = {};
    for (let i = 0; i < keys.length; ++i) {    
        if (keys[i] && m[i]) {
            q[keys[i]]= m[i];
        }
    }
    return q;    
}

