import axios from 'axios';

const context = 'http://192.168.0.102:8002';

export const insertRifa = (params) => {
  return axios
    .post(`${context}/rifa`, {
      titulo_rifa: params.titulo_rifa,
      desc_rifa: params.desc_rifa,
      imagem: params.imagem,
      valor: params.valor,
      tempo_sorteio: params.tempo_sorteio,
      usuarioID: params.usuarioID,
      status: 1,
      quant_cotas: params.quant_cotas,
      quant_ganhadores: params.quant_ganhadores,
      categoria: params.categoria,
    })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return false;
    })
    .finally(function () {
      // always executed
    });
};

export const fetchRifasPage = (page) => {
  return axios
    .get(`${context}/rifa/pagination/${page}`)
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

export const fetchRifasPageStatus = (page, status) => {
  return axios
    .get(`${context}/rifa/status/${status}/pagination/${page}`)
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

export const fetchRifasSearchTitle = (page) => {
  return axios
    .get(`${context}/rifa/pesquisar/pagination/${page}`)
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

export const fetchRifasID = (id) => {
  return axios
    .get(`${context}/rifa/${id}`)
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

export const fetchRifasUsuarioPage = (usuarioID, page) => {
  return axios
    .get(`${context}/rifa/usuario/${usuarioID}/pagination/${page}`)
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

export const fetchCotasUsuarioPage = (usuarioID, page) => {
  return axios
    .get(`${context}/cotas/usuario/${usuarioID}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return false;
    });
};

export const fetchRifasStatusPage = (status, page) => {
  return axios
    .get(`${context}/rifa/status/${status}/pagination/${page}`)
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

export const fetchRifasCategoriasPage = (categoria, page) => {
  return axios
    .get(`${context}/rifa/categoria/${categoria}/pagination/${page}`)
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
