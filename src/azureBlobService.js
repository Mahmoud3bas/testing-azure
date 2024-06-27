import { BlobServiceClient } from "@azure/storage-blob";
import { useRef, useState } from "react";

const containerName = "testmdbee"; // Replace with your container name

export const useUploadFileToBlob = () => {
  const blobClientRef = useRef(null);
  const [blocksList, setBlocksList] = useState([]);

  const uploadFile = async (file) => {
    if (!file) return [];
    await createClient();
    const blockSize = 4 * 1024 * 1024; // 4MB block size
    const blockIds = [];
    let blockCount = 0;

    for (let start = 0; start < file.size; start += blockSize) {
      blockCount++;
      const end = Math.min(start + blockSize, file.size);
      const blockContent = file.slice(start, end);
      const blockId = btoa(String(blockCount).padStart(5, "0")); // Base64-encoded block ID
      blockIds.push(blockId);

      try {
        await blobClientRef.current.stageBlock(
          blockId,
          blockContent,
          blockContent.size
        );
      } catch (error) {
        console.error("Error staging block:", error);
        throw error;
      }
    }   
  };

  const getFileLink = async () => {
    const blockBlobClient = await blobClientRef.current.commitBlockList(
      blocksList.map((block) => block.blockId)
    );
    return blockBlobClient.url;
  };

  const createClient = async () => {
    const blobServiceClient = new BlobServiceClient(
      `https://testmdbee.blob.core.windows.net?sp=r&st=2024-06-27T20:55:41Z&se=2024-06-28T04:55:41Z&spr=https&sv=2022-11-02&sr=b&sig=0lkKTLLIRSRsBwLyUqMV4%2FVpFwcKcirzFkqHYt3ovZU%3D`
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = new Date().getTime() + "-" + "test.wav";
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    blobClientRef.current = blockBlobClient;
  };

  return { uploadFile, getFileLink
   };
};
