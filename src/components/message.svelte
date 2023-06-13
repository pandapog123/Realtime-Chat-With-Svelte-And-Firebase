<script lang="ts">
  import { onMount } from "svelte";
  import { currentFirestoreUser, getUserData } from "../firebase/firestore";
  import type { message } from "../types/message";

  export let message: message;

  let messageImageURL = "";

  onMount(async () => {
    if (
      $currentFirestoreUser != null &&
      message.userid != $currentFirestoreUser.uid &&
      $currentFirestoreUser.display_image_url != null
    ) {
      const userData = await getUserData(message.userid);

      messageImageURL = userData?.display_image_url || "";
    }
  });
</script>

{#if $currentFirestoreUser != null}
  <div class="message-container">
    {#if message.userid != $currentFirestoreUser.uid && $currentFirestoreUser.display_image_url != null}
      <img src={messageImageURL} alt="User" />
    {/if}

    <div
      class="message-content"
      class:from-user={message.userid == $currentFirestoreUser.uid}
    >
      {message.content}
    </div>
  </div>
{/if}

<style>
  img {
    border-radius: 100px;
    height: 30px;
    width: 30px;
    margin-right: 8px;
  }

  .message-container {
    display: flex;
    align-items: flex-start;
    max-width: 65%;
    word-wrap: break-word;
  }

  .message-content {
    background: rgb(92, 92, 92);
    border-radius: 20px;
    padding: 8px;
    width: 100%;
  }

  .from-user {
    background-color: rgb(0, 125, 255);
  }
</style>
