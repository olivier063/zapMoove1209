import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import StorageService from '../services/storageService';

const UniqueModal = () => {
    const [modalDisplayed, setModalDisplayed] = useState(false);

    useEffect(() => {
        // Vérifier si la modale a déjà été affichée
        StorageService.load({ key: 'modalDisplayed' }).then(value => {
            if (value === null) {
                // La modale n'a pas encore été affichée, on met à jour l'état
                setModalDisplayed(true);
            } else {
                // La modale a déjà été affichée, on ne l'affiche pas
                setModalDisplayed(false);
            }
        });
        console.log("UseEffect", modalDisplayed)
    });

    const closeModal = () => {
        console.log('closeModal')
        try {
            // Fermer la modale et enregistrer l'état dans le stockage local
            setModalDisplayed(false);
            StorageService.save({
                key: 'modalDisplayed', // Note: Do not use underscore("_") in key!
                data: modalDisplayed,
            })
        } catch (error) {
            console.log(error.message);
        }
    }



    return (
        <View >
            <Modal isVisible={modalDisplayed}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalView}>
                    <Text>
            // Contenu de la modale
                    </Text>
                    <TouchableOpacity onPress={() => closeModal()}>
                        <Text>
                            Fermer la modale
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

export default UniqueModal;

const styles = StyleSheet.create({
    modalView: {
        height: 100,
        marginTop: 380,
        backgroundColor: "white",
        borderRadius: 7,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
})
