import storageHelper from "../utils/storage";

class StorageService {
  private readonly MANUFACTURERS_IMAGES_BUCKET = "manufacturers";

  public async uploadManufacturerFile(
    file: File,
    userId: string,
    fileName?: string
  ) {
    const filePath = `${userId}/manufacturers/${
      fileName || "unnamed"
    }-${Date.now()}`;

    const data = await storageHelper.uploadFile(
      file,
      this.MANUFACTURERS_IMAGES_BUCKET,
      filePath
    );

    return data;
  }

  public async deleteManufacturerFile(url: string) {
    const urlParts = url.split("/");
    const publicIndex = urlParts.indexOf("public");

    if (publicIndex === -1 || publicIndex + 2 >= urlParts.length) {
      console.error("Invalid storage URL format:", url);
      return false;
    }

    // The path starts after the bucket name in the URL
    const fullPath = urlParts.slice(publicIndex + 2).join("/");

    return await storageHelper.deleteFile(
      fullPath,
      this.MANUFACTURERS_IMAGES_BUCKET
    );
  }
}

const storageService = new StorageService();

export default storageService;
