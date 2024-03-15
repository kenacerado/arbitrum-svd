import { Contract, ContractRunner } from "ethers";
import abi from "./abi.json";

export function getContract(signer: ContractRunner) {
    return new Contract(
        "0x412948f4D605b51cE2F9e566d7708Cb759BA891e",
        abi as any,
        signer
    );
}