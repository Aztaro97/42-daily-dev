import { type NextApiRequest, type NextApiResponse } from "next";


export default function handler(res: NextApiResponse, req: NextApiRequest) {
	if (req.method == "GET") {
		try {
			return res.status(200).json({
				message: "Request Successfuly"
			})

		} catch (error) {
			res.status(500).json({
				message: "Enable tho fetch the data"
			})
		}
	}

}