import jwt, { decode } from 'jsonwebtoken'
import { throwErr } from '../util/defaultResponse.js'

export const generateToken = (user) => {
    const expiresIn = '7d'
    const expiresInRefresh = '30d'
    
    const accessToken = jwt.sign({ Name: user.Name, UserName: user.UserName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn })
    const refreshToken = jwt.sign({ Name: user.Name, UserName: user.UserName }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: expiresInRefresh })
    
    const expiresAt = (decode(accessToken).exp - (60 * 60)) * 1000 // Kasi padding 60 menit sebelum exp buat refresh
    // const expiresAt = decode(accessToken).exp;

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiredToken: expiresAt
    }
};

export const authToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
      
        if (token == null)
          throw new Error('Authorization is empty, please re login to renew your session!!!')
      
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
          if (err)
            throw new Error('Authorization has been denied for this request, please re login to renew your session!!!')
          req.user = user
          next() // Token valid, lanjutkan ke handler endpoint
        })

    } catch (err) {
        res.send(throwErr(err))
    }
    return ''
};
