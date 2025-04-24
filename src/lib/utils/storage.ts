import { v4 as uuidv4 } from "uuid";

import { supabase } from "../supabase/client";

class StorageHelper {
  public async uploadFile(file: File, bucketName: string, path?: string) {
    if (typeof bucketName !== "string")
      throw new Error("Bucket name is invalid");

    const fileName = path ?? `${file.name}-${uuidv4()}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "3600",
      });

    if (error) throw error;

    const publicUrl = await this.getPublicUrl(data.path, bucketName);

    return { ...data, publicUrl };
  }

  public async getPublicUrl(path: string, bucketName: string) {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(path);

    return data.publicUrl;
  }

  public async deleteFile(path: string, bucketName: string) {
    const { error } = await supabase.storage.from(bucketName).remove([path]);
    if (error) throw error;
    return true;
  }
}

const storageHelper = new StorageHelper();

export default storageHelper;
