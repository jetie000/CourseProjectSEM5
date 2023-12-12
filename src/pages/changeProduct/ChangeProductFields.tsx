import React, { ChangeEvent, SyntheticEvent } from "react";
import { IProductFields, IProductFieldsType } from "@/types/productFields.interface";


function ChangeProductFields({ fieldsType, fields, setFields, setFieldsType }:
    { fieldsType: IProductFieldsType[], fields: IProductFields[], setFields: Function, setFieldsType: Function }) {

    const changeFieldName = (event: ChangeEvent<HTMLInputElement>, id: number) => {
        setFields(fields.map((field, index) => {
            if (index === id)
                field.fieldName = event.currentTarget.value;
            return field;
        }));
    }

    const deleteField = (id: number) => {
        setFields(fields.filter((field, index) => index !== id));
        setFieldsType(fieldsType.filter((field, index) => index !== id))
    }

    const changeFieldValue = (event: ChangeEvent<HTMLInputElement>, id: number) => {
        let type = fieldsType[id].fieldType;
        switch (type) {
            case 'string':
                setFields(fields.map((field, index) => {
                    if (index === id)
                        field.stringFieldValue = event.target.value;
                    return field;
                })); break;
            case 'number':
                setFields(fields.map((field, index) => {
                    if (index === id)
                        field.doubleFieldValue = Number(event.target.value);
                    return field;
                })); break;
            case 'Date':
                setFields(fields.map((field, index) => {
                    if (index === id)
                        field.dateFieldValue = new Date(event.target.value);
                    return field;
                })); break;
            case 'boolean':
                setFields(fields.map((field, index) => {
                    if (index === id)
                        field.boolFieldValue = event.target.checked;
                    return field;
                })); break;
        }
    }

    return (
        <>
            {fieldsType.length > 0 && fieldsType.map((field, index) =>
                <div key={index} className="input-group mb-1">
                    <input onChange={e => changeFieldValue(e, index)} type={
                        field.fieldType === 'string' ?
                            'text' : (
                                field.fieldType === 'number' ?
                                    'number' : (
                                        field.fieldType === 'Date' ?
                                            'datetime-local' :
                                            'checkbox'
                                    ))
                    } className={"item-field form-control " + (field.fieldType === 'boolean' && 'form-check-input p-2 pe-3 pt-3 pb-4 mt-0')} id={"input" + field.id}
                    />
                    <input onChange={event => changeFieldName(event, index || 0)} id={'fieldInput' + index} type="text" className="form-control" placeholder="Введите название поля" defaultValue={fields[index].fieldName}/>
                    <button className='btn btn-danger d-flex align-items-center' onClick={() => deleteField(index || 0)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                        </svg>
                    </button>
                </div>)
            }
        </>
    );
}

export default ChangeProductFields;