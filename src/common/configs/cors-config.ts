export const configCors = {
    origin: [
      process.env.REACT_FRONT_URL,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}