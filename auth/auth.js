import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized",
            data: null,
        });
    }

    const [bearerString, bearerToken] = authorization.split(" ");

    if (bearerString !== "Bearer") {
        return res.status(400).json({
            status: 400,
            message: "Bad request",
            data: null,
        });
    }

    try {
        var token = jwt.verify(bearerToken, req.app.get("secretKey"));
    } catch (error) {
        return next(error);
    }

    const authority = {
        id: token.id,
        email: token.email,
    };

    req.authority = authority;

    next();
};

export { isAuth };
