import { Observable } from "../models/Observable";
import { watchFile } from "fs";

const OrgObniz = require("obniz");

interface Display {
  clear(): void;
  qr(data: string, correction?: "L" | "M" | "Q" | "H"): void;
  raw(raw: number): void;
  draw(context: CanvasRenderingContext2D): void;
}

interface Animation {
  duration: number;
  state: (index: number) => void;
}

type DriveType = "5v" | "3v" | "open-drain";
type PullType = null | "5v" | "3v" | "0v";

interface IO {
  output(value: boolean): void;
  drive(type: DriveType): void;
  pull(pullType: PullType): void;
  input(cb: (value: boolean) => void): void;
  inputWait(): Promise<boolean>;
  animation(name: string, status: "loop" | "pause" | "resume", animations?: Animation[]): void;
}

type SwitchStatus = "none" | "push" | "left" | "right";
interface Switch {
  onchange(state: SwitchStatus): void;
  getWait(): Promise<SwitchStatus>;
}

interface BLETarget {
  uuids: string[],
  localName: string
}

interface BLESetting {
  duration: number;
}

interface BLEReadWritableObject {
  writeWait(dataArray: number[]): Promise<boolean>;
  writeNumberWait(value: number): Promise<boolean>;
  writeTextWait(text: string): Promise<boolean>;
  readWait(): Promise<number[] | undefined>;
}

interface BLEPeripheralCharacteristicDescriptor extends BLEReadWritableObject {}

interface BLEPeripheralCharacteristic extends BLEReadWritableObject {
  getDescriptor(): BLEPeripheralCharacteristicDescriptor;
}

interface BLEPeripheralService {
  getCharacteristic(uuid: string): BLEPeripheralCharacteristic;
}

interface BLEPeripheralError {
  error_code: number;
  message: string;
  device_address: string | null;
  service_uuid: string | null;
  characteristic_uuid: string | null;
  descriptor_uuid: string | null;
}

interface BLEPeripheralObject {
  adv_data: string;
  localName: string;
  iBeacon: null | {
    uuid: string;
    major: number;
    minor: number;
    power: number;
    rssi: number;
  };
  connect(): void;
  connectWait(): Promise<boolean>;
  onconnect(): void;
  disconnect(): void;
  disconnectWait(): Promise<boolean>;
  ondisconnect(): void;
  getService(uuid: string): BLEPeripheralService;
  onerror(error: BLEPeripheralError): void;
}

type BLEAdvertisementDataFlag =
  "limited_discoverable_mode" |
  "general_discoverable_mode" |
  "br_edr_not_supported" |
  "le_br_edr_controller" |
  "le_br_edr_host";

interface BLEAdvertisementData {
  flags: BLEAdvertisementDataFlag[];
  manufacturereData: {
    companyCode: number;
    serviceUuids: string[];
    data: number[];
  };
}

interface BLEScan {
  start(target?: BLETarget, setting?: BLESetting): void;
  end(): void;
  onfind(peripheral: BLEPeripheralObject): void;
}

interface BLEAdvertisement {
  start(): void;
  setAdvData(advertisementData: BLEAdvertisementData): void;
  setAdvDataRaw(bytes: number[]): void;
  setScanRespDataRaw(data: number[]): void;
  setScanRespData(setting: {
    serviceUuids: string[];
    localName: string;
    manufacturerData: {
      companyCode: number;
      data: number[];
    };
  }): void;
  end(): void;
}

interface BLEDescriptorOptions {
  uuid: string;
  text: string;
}

interface BLEDescriptor {
  new(options: BLEDescriptorOptions): BLEDescriptor;
  writeWait(dataArray: number[]): Promise<boolean>;
  readWait(): Promise<number[] | undefined>;
  onwritefromremote(data: {
    address: string;
    data: string;
  }): void;
  onreadfromremote(data: {
    address: string;
  }): void;
}

interface BLECharacteristicOptions {
  uuid: string,
  data: number[] | string;
  descriptors: Array<BLEDescriptorOptions| BLEDescriptor>;
}

interface BLECharacteristic {
  new(options: BLECharacteristicOptions): BLECharacteristic;
  writeWait(dataArray: number): Promise<boolean>;
  readWait(): Promise<number[] | undefined>;
  onwritefromremote(data: {
    address: string;
    data: string;
  }): void;
  onreadfromremote(data: {
    address: string;
  }): void;
}

interface BLEServiceOptions {
  uuid: string,
  characteristics? : Array<BLECharacteristicOptions | BLECharacteristic>;
}

interface BLEService {
  new(options: BLEServiceOptions): BLEService;
  advData: BLEAdvertisementData;
  end(): void;
}

interface BLEPeripheral {
  addService(service: BLEService): void;
  onconnectionupdates(data: {
    address: string;
    status: string;
  }): void;
  end(): void;
}

interface BLE {
  scan: BLEScan;
  advertisement: BLEAdvertisement;
  service: BLEService;
  peripheral: BLEPeripheral;
  characteristic: BLECharacteristic;
  descriptor: BLEDescriptor;
}

type Voltage = number;

interface AD {
  start(cb: (voltage: Voltage) => void): void;
  onchange(voltage: Voltage): void;
  value: Voltage;
  getWait(): Promise<Voltage>;
  end(): void;
}

interface PWM {
  start(options: {
    io: number;
    drive: DriveType;
    pull: PullType;
  }): void;
  freq(frequency: number): void;
  duty(percent: number): void;
  modulate(options: {
    modulationType: "am";
    interval: number;
    data: Array<0 | 1>;
  }): void;
  end(): void;
}

interface SPI {
  start(options: {
    mode: "master";
    clk: number;
    mosi: number;
    miso: number;
    frequency: number;
    drive: DriveType;
    pull: PullType;
  }): void;
  writeWait(data: number[]): Promise<number[]>;
  write(data: number[]): void;
  end(): void;
}

interface Obniz {
  new(id: string): Obniz;
  display: Display;
  onclose: () => void;
  // Utils
  reset(): void;
  repeat(cb: () => void): void;
  wait(ms: number): Promise<void>;
  keepWorkingAtOffline(working: boolean): void;
  // io
  io0: IO;
  // ad
  ad0: AD;
  // pwm
  pwm0: PWM;
  getFreePwm(): PWM;
  // spi
  spi0: SPI;
  getFreeSpi(): SPI;
  // switch
  switch: Switch;
  // ble
  ble: BLE;
}

export async function initializeObniz(id: string) {
  const obniz = new OrgObniz(id);
  return new Promise<Obniz>(r => obniz.onconnect = () => r(obniz));
}