
const useValidator = (inputType, value) => {

    switch (inputType) {
        case 'text':
            return /^[\w\d\sñ]{3,20}$/.test(value);
        case 'textarea':
            return /^[\w\d\sñ,]{10,150}$/.test(value);
        case 'email':
            return /^(?=.{5,81}$)[\w\.-]+@[\w\.-]+\.\w{2,4}$/.test(value);
        case 'password':
            return /^\w{6,16}$/.test(value);
        case 'number':
            return /^\d*\.?\d*$/.test(value);
        case 'url':
            return /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(value);
        default:
            return false;
    }

}

export default useValidator;