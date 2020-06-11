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

const PrintPromptText = styled.div`
    margin-bottom: 2rem; 
    color: ${colors.rddarkgray};
    text-align: center;
`

const PrintPromptButtons = styled.div`
    display: flex;
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
        <>
            <PrintPromptText>What document do you want to print?</PrintPromptText>
            <PrintPromptButtons>
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
            </PrintPromptButtons>
            {state.dispatchNoteTriggered && renderBlobProviders({ Component: PdfDispatchNote, fileName: 'dispatch-note' })}
            {state.invoiceTriggered && renderBlobProviders({ Component: PdfInvoice, fileName: 'invoice' })}
        </>
    );
};

export default PrintPopup;