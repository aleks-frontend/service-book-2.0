import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';

import Button from './UI/Button';
import PdfDispatchNote from './PDF/PdfDispatchNote';
import getEntityByIdAPI from '../API/getEntityById';
import { AppContext } from './AppProvider';

const PrintButton = (props) => {
    const context = React.useContext(AppContext);
    const [state, setState] = React.useState({
        isShowBlobProvider: true,
        customer: props.customer || null
    });

    const downloadPDF = () => {
        if (state.pdfGenerated) {
            const data = window.URL.createObjectURL(state.pdfBlob);
            const link = document.createElement('a');
            link.href = data;
            link.download = `dispatch-note-${props.service.id}.pdf`;
            link.click();

            setState({ isShowBlobProvider: false });
            // formReset();
        }        
    };

    const testRender = () => {
        console.log('render ' + state.isShowBlobProvider);
        return 'Hello';
    }

    const renderButtons = () => {
        if (state.isShowBlobProvider) {
            return (
                <React.Fragment>
                    <Button
                        type="button"
                        margin="0 0 0 0.5rem"
                        disabled={!state.pdfGenerated}
                        onClick={downloadPDF}
                    >
                        {state.pdfGenerated ? 'Download PDF' : 'Generating PDF'}
                    </Button>
                    <PDFDownloadLink document={
                        <PdfDispatchNote
                            service={props.service}
                            customer={state.customer}
                        />}
                    >
                        {({ blob, loading }) => {
                            if (!loading && !state.pdfGenerated) {
                                setState({
                                    ...state,
                                    pdfBlob: blob,
                                    pdfGenerated: true
                                });
                            }
                        }}
                    </PDFDownloadLink>
                </React.Fragment>
            )
        }
    }

    return (
        <React.Fragment>
            {testRender()}
            {renderButtons()}
        </React.Fragment>
    );
};

export default PrintButton;