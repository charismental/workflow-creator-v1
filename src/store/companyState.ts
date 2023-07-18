import { NumberBoolean } from "types";
import { useMainState } from "./useMainState";

const { setState, getState } = useMainState;

export const toggleCompanyForProcess = (company: string) => {
	const { activeProcess } = getState();
	if (activeProcess) {
		const { companies = [] } = activeProcess;

		let updatedCompanies = companies;

		if (companies.some(({ companyName }) => companyName === company)) {
			updatedCompanies = companies.filter(({ companyName }) => companyName !== company);
		} else {
			const initialNumberBoolean: NumberBoolean = 0;

			const newCompany = {
				companyId: null,
				companyName: company,
				isInternal: initialNumberBoolean,
				isTrusted: false,
			};

			updatedCompanies = companies.concat(newCompany);
		}
		setState({ activeProcess: { ...activeProcess, companies: updatedCompanies } });
	}
};

export const addNewCompany = (company: string) =>
	setState(({ companies }) => {
		const initialNumberBoolean: NumberBoolean = 0;

		const newCompany = {
			companyId: null,
			companyName: company,
			isInternal: initialNumberBoolean,
			isTrusted: false,
		};
		return { companies: companies.concat(newCompany) };
	});
