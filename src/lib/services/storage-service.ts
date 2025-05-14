import storageHelper from "../utils/storage";

class StorageService {
  // Storage bucket names
  readonly PRODUCTS_IMAGES_BUCKET = "products";
  readonly MANUFACTURERS_IMAGES_BUCKET = "manufacturers";
  readonly REPRESENTATIVE_IMAGES_BUCKET = "representative";

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

  public async deleteManufacturerFile(fileUrl: string | undefined) {
    if (!fileUrl) return;
    return await this.deleteFile(fileUrl, this.MANUFACTURERS_IMAGES_BUCKET);
  }

  public async uploadProductFile(
    file: File,
    userId: string,
    fileName?: string
  ) {
    const filePath = `${userId}/products/${
      fileName || "unnamed"
    }-${Date.now()}`;

    const data = await storageHelper.uploadFile(
      file,
      this.PRODUCTS_IMAGES_BUCKET,
      filePath
    );

    return data;
  }

  public async uploadRepresentativeAddressFile(
    file: File,
    userId: string,
    fileName?: string
  ) {
    const filePath = `${userId}/representatives/${
      fileName || "unnamed"
    }-${Date.now()}`;

    const data = await storageHelper.uploadFile(
      file,
      this.REPRESENTATIVE_IMAGES_BUCKET,
      filePath
    );

    return data;
  }

  public async deleteProductFile(fileUrl: string | undefined) {
    if (!fileUrl) return;
    return await this.deleteFile(fileUrl, this.PRODUCTS_IMAGES_BUCKET);
  }

  public async deleteRepresentativeAddressFile(fileUrl: string | undefined) {
    if (!fileUrl) return;
    return await this.deleteFile(fileUrl, this.REPRESENTATIVE_IMAGES_BUCKET);
  }

  private async deleteFile(fileUrl: string, bucketName: string) {
    const urlParts = fileUrl.split("/");
    const publicIndex = urlParts.indexOf("public");

    if (publicIndex === -1 || publicIndex + 2 >= urlParts.length) {
      console.error("Invalid storage URL format:", fileUrl);
      return false;
    }

    // The path starts after the bucket name in the URL
    const fullPath = urlParts.slice(publicIndex + 2).join("/");

    return await storageHelper.deleteFile(fullPath, bucketName);
  }
}

const storageService = new StorageService();

export default storageService;
