interface IResponseAddress {
	cep: string;
	street: string;
	complement: string;
	district: string;
	city: string;
	state: string;
}

export async function VCAPI_CEP(cep: string): Promise<IResponseAddress> {
	try {
		const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

		const [address] = await response.json()

		return {
			cep: address.cep,
			city: address.localidade,
			complement: address.complemento,
			district: address.bairro,
			state: address.uf,
			street: address.logradouro
		}
	} catch (e) {
		console.log(e)
		throw new Error('search cep error')
	}
}

export async function VCAPI_STREET(street: string, city): Promise<IResponseAddress> {
	try {
		const response = await fetch(`https://viacep.com.br/ws/SP/${city}/${street}/json/`)
		const [address] = await response.json()

		return {
			cep: address.cep,
			city: address.localidade,
			complement: address.complemento,
			district: address.bairro,
			state: address.uf,
			street: address.logradouro
		}
	} catch (e) {
		console.log(e)
		throw new Error('search cep error')
	}
}
