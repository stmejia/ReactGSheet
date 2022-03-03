import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Table } from "semantic-ui-react";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

function App() {

  const [Apidata, setAPIdata] = useState([]);
  const [refresh, setRefresh] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: "",
      surname: "",
      phone: "",
      dpi: "",
      email: "",
      date: "",
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("El Nombre es requerido"),
      surname: yup.string().required("El Apellido es requerido"),
      phone: yup.string().required("El Telefono es requerido"),
      dpi: yup
        .string()
        .required("El DPI es requerido")
        .matches(/^[0-9]{4}\s?[0-9]{5}\s?[0-9]{4}$/, "El DPI no es válido"), //Con la siguiente expresión lambda validamos que el DPI exista
      email: yup
        .string()
        .email("Formato de Email inválido")
        .required("El email es requerido"),
    }),
    onSubmit: (values) => {
      //console.log(values);
      let body = { ...values, date: new Date() };
      // TODO: realizar la petición
      axios
        .post(
          "https://sheet.best/api/sheets/2ea755cb-5aa0-485d-805d-24e0a1018f16",
          body
        )
        .then((data) => {
          setRefresh(data);
          console.log(data);
        });
    },
  });

  //Obtenemos la data del sheet
  useEffect(() => {
    axios.get("https://sheet.best/api/sheets/2ea755cb-5aa0-485d-805d-24e0a1018f16")
      .then((res) => {
        setAPIdata(res.data);
      })
  }, [refresh])

  return (
    <Container
      style={{
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Formulario de registro</h1>
      <Form style={{ width: "30%" }} onSubmit={formik.handleSubmit}>
        <Form.Input type="text" placeholder="Nombre" name="name" onChange={formik.handleChange} error={formik.errors.name} value={formik.values.name} />
        <Form.Input type="text" placeholder="Apellidos" name="surname" onChange={formik.handleChange} error={formik.errors.surname} value={formik.values.surname} />
        <Form.Input type="text" placeholder="Teléfono" name="phone" onChange={formik.handleChange} error={formik.errors.phone} value={formik.values.phone} />
        <Form.Input type="text" placeholder="DPI" name="dpi" onChange={formik.handleChange} error={formik.errors.dpi} value={formik.values.dpi} />
        <Form.Input type="text" placeholder="Email" name="email" onChange={formik.handleChange} error={formik.errors.email} value={formik.values.email} />
        <Button type='submit'>Guardar</Button>
        <Button type='button' onClick={formik.handleReset}>Limpiar Formulario</Button>
      </Form>

      <h1>Datos almacenados en sheets docs</h1>
      <Table fixed style={{ padding: 20 }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Nombre</Table.HeaderCell>
            <Table.HeaderCell>Apellidos</Table.HeaderCell>
            <Table.HeaderCell>Teléfono</Table.HeaderCell>
            <Table.HeaderCell>DPI</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {Apidata.map((data) => {
            return (
              <Table.Row>
                <Table.Cell>{data.name}</Table.Cell>
                <Table.Cell>{data.surname}</Table.Cell>
                <Table.Cell>{data.phone}</Table.Cell>
                <Table.Cell>{data.dpi}</Table.Cell>
                <Table.Cell>{data.email}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </Container>
  );
}

// const validationSchema = yup.object().shape({
//   name: yup.string().required("El Nombre es requerido"),
//   surname: yup.string().required("El Apellido es requerido"),
//   phone: yup.string().required("El Telefono es requerido"),
//   dpi: yup
//     .string()
//     .required("El DPI es requerido")
//     .matches(/^[0-9]{4}\s?[0-9]{5}\s?[0-9]{4}$/, "El DPI no es válido"), //Con la siguiente función lambda validamos que el DPI exista
//   email: yup
//     .string()
//     .email("Formato de Email inválido")
//     .required("El email es requerido"),
// });

export default App;
