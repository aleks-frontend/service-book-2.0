import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet, Font } from '@react-pdf/renderer';

import { colors } from '../../helpers';

Font.register({
    family: 'Roboto-Bold',
    weight: '700',
    src: '/fonts/Roboto-Bold.ttf'
});

const styles = StyleSheet.create({
    page: {
        padding: 20,
        color: colors.rddarkgray
    },
    heading: {
        marginBottom: 20,
        fontSize: 15
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 20,
        paddingBottom: 20,
    },
    headerText: {
        flex: 1,
        fontSize: 12,
        fontFamily: 'Roboto-Bold'
    },
    companyInfo: {
        flex: 1,
        borderTop: 2,
        borderTopColor: colors.rdlightgray
    },
    companyInfoText: {
        display: 'block',
        marginTop: 1,
        fontSize: 10,
        lineHeight: '1em'
    },
    logo: {
        display: 'block',
        marginLeft: 5,
        width: 100
    },
    customerInfo: {
        fontSize: 12
    },
    customerInfoHeader: {
        fontFamily: 'Roboto-Bold',
        padding: 5,
        backgroundColor: colors.rdlightgray,
        color: '#000'
    },
    customerInfoGroup: {
        flexDirection: 'row',
        marginBottom: 5,
        fontSize: 10
    },
    customerInfoLabel: {
        fontFamily: 'Roboto-Bold'
    },
    serviceGroup: {
        marginBottom: 10,
        fontSize: 0
    },
    serviceLabel: {
        padding: 5,
        fontFamily: 'Roboto-Bold',
        fontSize: 10,
        color: '#000',
        backgroundColor: colors.rdlightgray,
    },
    serviceText: {
        padding: '10px 5px',
        border: 1,
        borderTop: 0,
        fontSize: 10,
        color: colors.rddarkgray,
        borderColor: colors.rdlightgray
    },
    devicesItem: {
        marginBottom: 5,
    },
    devicesSerial: {
        marginLeft: 5,
        fontSize: 9
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50
    },
    signature: {
        paddingTop: 10,
        width: '40%',
        borderTop: 1,
        borderBottomColor: colors.rddarkgray
    },
    signatureName: {
        fontSize: 12,
        fontFamily: 'Roboto-Bold',
        textAlign: 'left',
        color: colors.rdgray
    }
});

const modifiers = StyleSheet.create({
    serviceTextDescription: {
        ...styles.serviceText,
        height: 150
    },
    companyInfoTextMain: {
        ...styles.companyInfoText,
        fontFamily: 'Roboto-Bold'
    }
});

const PdfDispatchNote = (props) => {
    const { service, customer } = props;
    
    const devices = service.devices;

    const renderDevices = () => (
        devices.map(device => {
            const { name, serial, id } = device;

            return (
                <View style={styles.devicesItem} key={id}>
                    <Text style={styles.devicesText}>- {name}</Text>
                    <Text style={styles.devicesSerial}>{serial && `(sn: ${serial})`}</Text>
                </View>
            )
        })
    )

    const renderCustomerInfoItem = ({ label, value }) => {
        if (!customer[value]) return;
        return (
            <View style={styles.customerInfoGroup}>
                <Text style={styles.customerInfoLabel}>{label}: </Text>
                <Text style={styles.customerInfoText}>{customer[value]}</Text>
            </View>
        )
    }

    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.headerText}>
                        <Text style={styles.headerTitle}>Service ID: {service.id}</Text>
                        <View style={styles.companyInfo}>
                            <Text style={modifiers.companyInfoTextMain}>[Serviceman Name]</Text>
                            <Text style={styles.companyInfoText}>[Serviceman Address]</Text>
                            <Text style={styles.companyInfoText}>[Serviceman Phone]</Text>
                        </View>
                    </View>
                    <Image style={styles.logo} src="/img/sb-logo.png" />
                </View>
                <View style={styles.body}>
                    <View style={styles.serviceGroup}>
                        <View style={styles.customerInfo}>
                            <Text style={styles.customerInfoHeader}>Customer Info</Text>
                            <View style={styles.serviceText}>
                                {renderCustomerInfoItem({ label: 'Name', value: 'name' })}
                                {renderCustomerInfoItem({ label: 'Email', value: 'email' })}
                                {renderCustomerInfoItem({ label: 'Phone', value: 'phone' })}
                                {renderCustomerInfoItem({ label: 'Address', value: 'address' })}
                            </View>
                        </View>
                    </View>
                    <View style={styles.serviceGroup}>
                        <Text style={styles.serviceLabel}>Service Devices:</Text>
                        <View style={styles.serviceText}>
                            {renderDevices()}
                        </View>
                    </View>
                    <View style={styles.serviceGroup}>
                        <Text style={styles.serviceLabel}>Service Description:</Text>
                        <Text style={modifiers.serviceTextDescription}>{service.description}</Text>
                    </View>
                </View>
                <View style={styles.footer}>
                    <View style={styles.signature}>
                        <Text style={styles.signatureName}>Zoltan Kalmar</Text>
                    </View>
                    <View style={styles.signature}>
                        <Text style={styles.signatureName}>{customer.name}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default PdfDispatchNote;
