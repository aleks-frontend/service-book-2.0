import React from 'react';
import styled from 'styled-components';
import { BlobProvider } from '@react-pdf/renderer';

import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import PdfDispatchNote from '../PDF/PdfDispatchNote';
import PdfInvoice from '../PDF/PdfInvoice';
import { colors } from '../../helpers';

import fetchApi from '../../fetchApi';
import { getAppToken } from '../../auth';

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
    const { service } = props;
    const [state, setState] = React.useState({
        dispatchNoteTriggered: false,
        invoiceTriggered: false,
        customer: null
    });    

    React.useEffect(() => {
        (async () => {            
            const customer = (await fetchApi({
                url: `/customers/${service.customer.id}`,
                method: 'GET',
                token: getAppToken()
            })).data;

            setState({ ...state, customer });
        })();
    }, []);

    const renderBlobProviders= ({ Component, fileName }) => {
        const pdfProps = {
            service,
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
                        // setTimeout is needed because of some warning in react@16.13.1
                        // Some confilct with @react-pdf/renderer@1.6.8
                        setTimeout(() => {
                            props.hidePopup();
                        }, 0);
                        return <div></div>;
                    } else {
                        return <LoadingSpinner />;
                    }
                }}
            </BlobProvider>
        )
    };

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