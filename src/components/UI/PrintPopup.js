import React from 'react';
import styled from 'styled-components';
import { BlobProvider } from '@react-pdf/renderer';

import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import PdfDispatchNote from '../PDF/PdfDispatchNote';
import PdfInvoice from '../PDF/PdfInvoice';
import { AppContext } from '../AppProvider';
import { colors } from '../../helpers';

import getEntityByIdAPI from '../../API/getEntityById';

const StyledPrintPopup = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 1rem;
    width: 40rem;
    max-width: 40rem;
    background: #fff;
    border-radius: 0.3rem;

    .text {
        margin-bottom: 2rem; 
        color: ${colors.rddarkgray}; }

    .buttons {
        display: flex; }
`;

const StyledPrintPopupLoader = styled.div`
    position: absolute;
    top: 50%;
    left: 50;
    transform: translateY(-50%, -50%);
    width: 2rem;
    height: 2rem;
    background: red;
    border-radius: 50%;
`;

const PrintPopup = (props) => {
    const context = React.useContext(AppContext);
    const { service } = props;
    const [state, setState] = React.useState({
        dispatchNoteTriggered: false,
        invoiceTriggered: false,
        customer: null
    });    

    React.useEffect(() => {
        (async () => {
            const customer = await getEntityByIdAPI({
                token: context.token,
                entityName: 'customers',
                id: service.customer.id
            });

            setState({ ...state, customer });
        })();
    }, []);

    const renderBlobProviders= ({ Component, fileName }) => {
        const pdfProps = {
            service,
            token: context.token,
            customer: state.customer
        };

        return (
            <BlobProvider document={<Component {...pdfProps} />}>
                {({ blob, loading }) => {
                    if (!loading) {
                        const data = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = data;
                        link.download = `${fileName}-${service.id}.pdf`;
                        link.click();
                        props.hidePopup();
                        return <div></div>;
                    } else {
                        return <LoadingSpinner />;
                    }
                }}
            </BlobProvider>
        )
    }

    return (
        <StyledPrintPopup onClick={(e) => e.stopPropagation()}>
            <div className="text">What document do you want to print?</div>
            <div className="buttons">
                <Button
                    type="button"
                    margin="0 0 0 0.5rem"
                    onClick={() => setState({ ...state, dispatchNoteTriggered: true })}
                    disabled={!state.customer || state.dispatchNoteTriggered || state.invoiceTriggered}
                >
                    Dispatch Note
                </Button>
                <Button
                    type="button"
                    margin="0 0 0 0.5rem"
                    onClick={() => setState({ ...state, invoiceTriggered: true })}
                    disabled={!state.customer || state.dispatchNoteTriggered || state.invoiceTriggered}
                >
                    Invoice
                </Button>
            </div>
            {state.dispatchNoteTriggered && renderBlobProviders({ Component: PdfDispatchNote, fileName: 'dispatch-note' })}
            {state.invoiceTriggered && renderBlobProviders({ Component: PdfInvoice, fileName: 'invoice' })}
        </StyledPrintPopup>
    );
};

export default PrintPopup;