import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import { Modal, Button } from 'react-bootstrap';


export default function TechnicalTest() {
    const [data, setData] = useState([]);
    const [modelInfo, setModelInfo] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const [show, setShow] = useState(false);
    const [modalData, setModalData] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const api = 'https://api.coingecko.com/api/v3/';
    const  url = 'coins/markets?';

    useEffect(() => {
        axios.get(`${api}${url}vs_currency=eur&order=market_cap_desc&per_page=10&page=1&sparkline=false`)
            .then((res) => {
                setData(res.data);
            }).catch(error => {
                console.log("Error in request loading table data ", error);
            })
    }, []); 

    const columns = [
        {
            text: 'Image', dataField: 'image', formatter: (cell, row) => (
                <span>
                    <img src={row.image} style={{ width: 30, borderRadius: "50%" }} alt="..." />
                </span>
            )
        },
        { text: 'Name', dataField: 'name' },
        { text: 'Symbol', dataField: 'symbol' },
        { text: 'Current Price', dataField: 'current_price' },
        { text: 'High 24 hour Price', dataField: 'high_24h' },
        { text: 'Low 24 hour Price', dataField: 'low_24h' }
    ];

    const rowEvents = {
        onClick: (e, row) => {
            axios
                .get(`${api}/coins/${row.id}`)
                .then((res) => {
                    setModalData(res.data);
                }).catch(error => {
                    console.log("Error in request loading table data ", error);
                });
            setModelInfo(row);
            toggleTrueFalse();
        }
    };

    const toggleTrueFalse = () => {
        setShowModel(handleShow);
    };

    const ModelContent = () => {
        return (
            <Modal show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                    <Modal.Title >
                        {modelInfo.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <h3>{modelInfo.name} Data</h3>
                    <ul>                     
                        <li>Name:  {modalData.name}</li>
                        <li>Symbol: {modalData.symbol}</li>
                        <li>Hash Alogrithem:  {modalData.hashing_algorithm}</li>
                        <li>Genesis Date:  {modalData.genesis_date}</li>
                    </ul>                
                      
                </Modal.Body>
                <Modal.Footer>
                    <Button varint="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };
    return <div>
        <div className='container'>
            <BootstrapTable keyField='id' data={data} columns={columns} rowEvents={rowEvents} />
            {show ? <ModelContent /> : null}
        </div>
    </div>;
}
