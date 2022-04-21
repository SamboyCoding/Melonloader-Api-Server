import ToolVersion from "../entity/ToolVersion";

export default class V2RuntimeToolInfo {
    public name: string;
    public downloadUrl: string;
    public destinationPath: string;
    public compressionType: "none" | "gzip" | "zip";
    public commandLineTemplate: string;
    public environmentVariables: string;
    public outputPaths: string;

    public static fromToolVersion(toolVers: ToolVersion): V2RuntimeToolInfo {
        const toolInfo = new V2RuntimeToolInfo();
        toolInfo.name = toolVers.tool.name;
        toolInfo.downloadUrl = toolVers.tool.downloadUrlTemplate.replaceAll("${VERSION}", toolVers.version);
        toolInfo.destinationPath = toolVers.tool.destinationPath;
        toolInfo.compressionType = toolVers.tool.compressionType;
        toolInfo.commandLineTemplate = toolVers.tool.commandLineTemplate;
        toolInfo.environmentVariables = toolVers.tool.environmentVariables;
        toolInfo.outputPaths = toolVers.tool.outputPaths;
        return toolInfo;
    }
}