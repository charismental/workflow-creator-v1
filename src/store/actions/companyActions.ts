import { CompanyActions, MainStore, NumberBoolean } from "types"

export const companyActions = (set: any, get: () => MainStore): CompanyActions => ({
    toggleCompanyForProcess: (company: string) => {
        const { activeProcess, setSnapshot } = get();
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

            const updatedActiveProcess = { ...activeProcess, companies: updatedCompanies };
            
            setSnapshot({ ...updatedActiveProcess });

            set(
                { activeProcess: updatedActiveProcess },
                false,
                'toggleCompanyForProcess',
            );
        }
    },
    addNewCompany: (company: string) => {
        const { companies } = get();
        const initialNumberBoolean: NumberBoolean = 0;

        const newCompany = {
            companyId: null,
            companyName: company,
            isInternal: initialNumberBoolean,
            isTrusted: false,
        };

        set({ companies: companies.concat(newCompany) }, false, 'addNewCompany');
    },
});