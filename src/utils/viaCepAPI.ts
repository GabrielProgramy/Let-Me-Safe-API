interface IResponseAddress {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export async function viaCepAPI(cep: string): Promise<IResponseAddress> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

    return response.json()
  } catch (e) {
    throw new Error('search cep error')
  }
}
