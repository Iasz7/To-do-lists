import { buildLogger, getUUID} from "./config/plugins";

const logger =  buildLogger("index.ts");

logger.log("Starting the application...");

logger.error("simulacion de error...");

const id = getUUID()
logger.log(`Probando generador de id ${id}`);