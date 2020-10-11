jest.setTimeout(30000)

const requiredEnv = [
    'DEBUG_RF_USER_1',
    'DEBUG_RF_USER_PWD_1',
    'DEBUG_RF_USER_2',
    'DEBUG_RF_USER_PWD_2',
    'DEBUG_RF_URL'
]

let exit = false;
requiredEnv.forEach(name => {
    if (process.env[name]) return

    throw Error(`Requered ${name} in env`)
})
