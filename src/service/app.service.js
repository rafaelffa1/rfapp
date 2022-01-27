import axios from 'axios';

const context = 'http://192.168.0.102:8002';
export {context};

export const fetchSessionToken = () => {
  return axios
    .get(`${context}/sessiontoken/pagseguro`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return false;
    })
    .finally(function () {
      // always executed
    });
};

export const enviarSMS = (sms) => {
  return axios
    .post(`${context}/enviar/sms`, {
      text: sms.text,
      phone: sms.phone,
    })
    .then(function (response) {
      return true;
    })
    .catch(function (error) {
      return false;
    })
    .finally(function () {
      // always executed
    });
};

export const selecionarTodasCategorias = () => {
  return axios
    .get(`${context}/categorias`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // handle error
      console.error(error);
    })
    .finally(function () {
      // always executed
    });
};

export const inserirUsuario = (usuario) => {
  // usuario.tokenDevice = tokenDevice;
  return axios
    .post(`${context}/usuarios/mobile`, usuario)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    })
    .finally(function () {
      // always executed
    });
};

export const loginNormal = (usuario) => {
  return axios
    .post(`${context}/login/mobile`, usuario)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    })
    .finally(function () {
      // always executed
    });
};

export const validarUsuarioCelular = (celular) => {
  return axios
    .get(`${context}/usuarios/validar/celular/${celular}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const validarUsuarioEmail = (email) => {
  return axios
    .get(`${context}/usuarios/validar/email/${email}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const validarUsuarioSocialID = (socialID) => {
  return axios
    .get(`${context}/usuarios/validar/socialID/${socialID}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.warn(error);
    });
};

export const redefinirSenha = (email) => {
  return axios
    .post(`${context}/usuario/redefinir`, email)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    })
    .finally(function () {
      // always executed
    });
};

export const atualizarUsuario = (usuario) => {
  return axios
    .put(`${context}/usuarios/mobile`, {
      usuarioID: usuario.id,
      nome: usuario.name,
      email: usuario.email,
    })
    .then(function (response) {
      return true;
    })
    .catch(function (error) {
      return false;
    })
    .finally(function () {
      // always executed
    });
};

export const selecionarDestaques = () => {
  axios.defaults.headers.get = {
    'Cache-Control': 'no-cache',
  };
  return axios
    .get(`${context}/destaque`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return false;
    })
    .finally(function () {
      // always executed
    });
};

export const favoritar = (usuarioID, produtoID) => {
  return axios
    .post(`${context}/favorito`, {
      usuarioID,
      produtoID,
    })
    .then(function (response) {
      return true;
    })
    .catch(function (error) {
      return false;
    })
    .finally(function () {
      // always executed
    });
};

export const fetchEstadosIBGE = () => {
  return axios
    .get('http://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return false;
    })
    .finally(function () {
      // always executed
    });
};

export const fetchUsuarioID = (usuarioID) => {
  return axios
    .get(`${context}/usuarios/id/${usuarioID}`)
    .then(function (response) {
      return response.data[0];
    })
    .catch(function (error) {
      return false;
    });
};

export const fetchFichaUsuarioID = (usuarioID) => {
  return axios
    .get(`${context}/usuarios/ficha/${usuarioID}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return false;
    });
};

export const acceptRaffle = (rifaID, tempoSorteio) => {
  return axios
    .put(`${context}/rifa/status`, {
      rifa: rifaID,
      status: 2,
      tempo_sorteio: tempoSorteio,
    })
    .then(function (response) {
      return true;
    })
    .catch(function (error) {
      return false;
    });
};

export const buyQuoata = (rifaID, usuarioComprador) => {
  return axios
    .post(`${context}/cotas`, {
      rifaID: rifaID,
      usuario_vendedor: null,
      usuario_comprador: usuarioComprador,
    })
    .then(function (response) {
      return true;
    })
    .catch(function (error) {
      return false;
    });
};

export const AddAddress = (usuarioID, address) => {
  return axios
    .post(`${context}/usuarios/endereco`, {
      usuarioID: usuarioID,
      cep: address.cep,
      estado: address.estado,
      cidade: address.cidade,
      bairro: address.bairro,
      endereco: address.endereco,
      numero: address.numero,
      lat: null,
      long: null,
    })
    .then(function (response) {
      return true;
    })
    .catch(function (error) {
      return false;
    });
};

export const updateFichaUsuario = (usuarioID, updateFicha) => {
  return axios
    .put(`${context}/usuarios/atualizar/ficha`, {
      usuarioID,
      updateFicha,
    })
    .then(function (response) {
      return true;
    })
    .catch(function (error) {
      return false;
    });
};

export const fetchUserWinnerRaffle = (quoataID) => {
  return axios
    .get(`${context}/raffle/quoata/${quoataID}/winner/prize`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return false;
    });
};
