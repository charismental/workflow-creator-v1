import AxiosDefault from "./AxiosDefault";
import { WorkflowProcess } from "store/types";

export default async (env?: string) => {
	AxiosDefault.get(`/api/GetTopLevel?code=${process.env.REACT_APP_SECRET_KEY}`, {
		validateStatus(status) {
			return status < 500;
		},
	})
		.then((res) => {
			console.log(res.data);
			if (res.data && res.data.length) {
				const processInfo: WorkflowProcess[] = res.data;
				return processInfo;
			}
		})
		.catch((error) => {
			console.log(error.toJSON());
		});
};
