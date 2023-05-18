import React, { useState, useEffect } from 'react';
import { Button, Col } from 'react-bootstrap';
import './App.css'
import * as paillierBigint from 'paillier-bigint';

const initialDataPoint = {
    num1: 0,
    num2: 0,
    encNum1: '',
    encNum2: '',
    addedEncNum: '',
    cipherTextToDecrypt: '',
    decryptedCipherText: '',
    publicKey: {},
    privateKey: {},
}

const HEForm = () => {

    const [result, setResult] = useState(initialDataPoint)
    const initializeKeys = async () => {
        const {publicKey, privateKey } = await paillierBigint.generateRandomKeys(1024)
        setResult({
            ...result,
            publicKey: publicKey,
            privateKey: privateKey,
        })
    }

    const handleValueOneChange = (e) => {
        setResult({
            ...result,
            num1: e.target.value
        })
    }

    const handleCipherTextChange = (e) => {
        console.log("In fn handleCipherTextChange: ", e.target.value)
        setResult({
            ...result,
            cipherTextToDecrypt: e.target.value
        })
    }

    const encryptValueOne = async () => {
        const et = result.publicKey.encrypt(parseInt(result.num1))
        console.log(result.num1, et)
        setResult({
            ...result,
            encNum1: et
        })
    }

    const handleValueTwoChange = (e) => {
        setResult({
            ...result,
            num2: e.target.value
        })
    }

    const encryptValueTwo = () => {
        const et2 = result.publicKey.encrypt(parseInt(result.num2))
        console.log(result.num2, et2)
        setResult({
            ...result,
            encNum2: et2,
        })
    }

    const performAdditiveEncryption = () => {
        if (result.encNum1 && result.encNum2) {
            const encryptedSum = result.publicKey.addition(result.encNum1, result.encNum2)
            setResult({
                ...result,
                addedEncNum: encryptedSum,
            })
        }
    }

    const decryptCipherText = () => {
        if (result.cipherTextToDecrypt) {
            const bigIntCipherText = BigInt(result.cipherTextToDecrypt.toString())
            const dt = result.privateKey.decrypt(bigIntCipherText)
            setResult({
                ...result,
                decryptedCipherText: dt,
            })
        }
    }

    useEffect(() => {
        initializeKeys()
    }, [])

    return (
        <>
            <h1>{'Homomorphic Encryption'}</h1>
            <div className={"container"}>
                <div className={"encryption-content"}>
                    <div className={"encryption-column"}>
                        <div className={"encryption-fields"}>
                            <label htmlFor="num1">{'Number #1:'}</label>
                            <input type="text" id="name" onChange={handleValueOneChange} placeholder="Enter the first number" />
                            <Button type={"primary"} onClick={() => encryptValueOne() }>{'Encrypt'}</Button>
                        </div>

                        {
                            result.encNum1
                                ?  
                                    <textarea value={result.encNum1.toString()} onChange={() => console.log("Text area cannot change")} rows="10" cols="100" className={"encrypted-text"} readOnly/>
                                :   <></>
                        }
                        

                        <div className={"encryption-fields"}>
                            <label htmlFor="num1">{'Number #2:'}</label>
                            <input type="text" id="name" onChange={handleValueTwoChange} placeholder="Enter the second plain text" />
                            <Button type="primary" onClick={() => encryptValueTwo() }>{'Encrypt'}</Button>
                        </div>
                        

                        {
                            result.encNum2
                                ?
                                    <textarea value={result.encNum2.toString()} onChange={() => console.log("Text area cannot change here")} rows="10" cols="100" className={"encrypted-text"} readOnly/>
                                :   <></>
                        }
                    </div>

                    <div className={"encryption-column"}>
                        <div className={"additive-encryption-fields"}>
                        { (result.encNum1 && result.encNum2)
                            ?
                                <>
                                    <div className={"add-encrypted-btn"}>
                                        <Button type="secondary" onClick={() => performAdditiveEncryption()}>{'Additive Encryption'}</Button>
                                    </div>
                                    { result.addedEncNum
                                        ? 
                                            <textarea value={result.addedEncNum.toString()} onChange={() => console.log("Text area cannot change here")} rows="10" cols="100" className={"added-encrypted-text"} readOnly/>
                                        :   <></>
                                    }
                                </>
                            :
                                <></>
                        }
                        </div>
                    </div>
                </div> 
            </div>
            <hr/>
            <h1>{'Homomorphic Decryption'}</h1>
            <div className={"container"}>
                <div className={"decryption-content"}>
                    <div className={"decryption-column"}>
                        <div className={"decryption-fields"}>
                            <textarea className={"ciphertextarea"} rows="10" cols="100" onChange={handleCipherTextChange} placeholder="Enter the cipher text" />
                            <Button className={"decrypt-btn"}type={"primary"} onClick={() => decryptCipherText() }>{'Decrypt'}</Button>
                        

                            {
                                result.decryptedCipherText
                                    ?  <div className={"decrypted-text"}>{result.decryptedCipherText.toString()}</div>
                                    :   <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    
};

export default HEForm;