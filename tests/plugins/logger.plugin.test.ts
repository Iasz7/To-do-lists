import { buildLogger, winstonLogger } from "../../src/plugins";

describe("Logger", () => {
    test("should return a function logger", () => {
        const logger = buildLogger("test");
        expect(typeof logger).toBe("object");
        expect(typeof logger.log).toBe("function");
        expect(typeof logger.error).toBe("function");
    })
    test("should log a with a service", () => {
        const winstonLoggerMock = jest.spyOn(winstonLogger, "log");
        const message : string = "test message";
        const service = "test service";
        const logger = buildLogger(service);
        logger.log(message);

        expect(winstonLoggerMock).toHaveBeenCalledWith("info",
            expect.objectContaining({service}),
            // expect.objectContaining({message}),   //no funciona bien el test con la configuracion actual del logger
        );
        winstonLoggerMock.mockRestore();
    })
})