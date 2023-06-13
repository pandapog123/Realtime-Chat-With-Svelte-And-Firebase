<script lang="ts">
  import { onMount } from "svelte";
  import Message from "../components/message.svelte";

  export let data;

  let authState = data.auth.authState;
  let currentFirestoreUser = data.firestore.currentFirestoreUser;
  let messages = data.firestore.messagesState;

  let loggingIn = false;

  async function handleClick() {
    await data.auth.signInWithGoogle();
  }

  let currentInput = "";

  function handleSubmit() {
    if (currentInput == "") {
      return;
    }

    data.firestore.sendMessage(currentInput);

    currentInput = "";
  }

  let scrollView: HTMLElement | null;

  $: if ($messages && scrollView != null) {
    scrollView.scroll({ top: scrollView.scrollHeight, behavior: "smooth" });
  }
</script>

{#if $authState == null}
  <main class="center">
    <button on:click={handleClick} disabled={loggingIn}>
      Log In With Google
    </button>
  </main>
{:else if $currentFirestoreUser == null}
  <main class="center">
    <span>Loading User Data...</span>
  </main>
{:else}
  <main class="app-container">
    <nav>
      <span class="header-title"> Realtime Chat With Svelte And Firebase </span>

      <div class="action">
        <button on:click={() => data.auth.auth.signOut()}>Sign Out</button>
      </div>
    </nav>

    <div class="chat-container">
      <div class="chat" bind:this={scrollView}>
        {#each $messages.reverse() as message}
          <div class="message">
            {#if message.userid == $currentFirestoreUser.uid}
              <div />
            {/if}

            <Message {message} />

            {#if message.userid != $currentFirestoreUser.uid}
              <div />
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <form on:submit|preventDefault={handleSubmit} class="message-form">
      <input type="text" bind:value={currentInput} />

      <button type="submit">Send Message</button>
    </form>
  </main>
{/if}

<style>
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    background-color: rgb(46, 46, 46);
    height: 5vh;
  }

  .header-title {
    font-size: 1.5em;
  }

  .chat-container {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    align-items: center;
    height: 90vh;
  }

  .chat {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100vw;
    max-width: 700px;
    height: 100%;
    padding: 0 8px;
    background-color: rgb(46, 46, 46);
  }

  .message {
    margin: 4px;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .message-form {
    height: 5vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    background-color: rgb(46, 46, 46);
  }

  @media (max-width: 800px) {
    nav {
      height: 10vh;
      flex-direction: column;
      justify-content: center;
    }

    .chat-container {
      height: 85vh;
    }
  }

  input {
    padding: 8px;
    font-size: 1em;
    border: none;
    border-radius: 8px;
  }

  input:active {
    outline: none;
  }

  input:focus {
    outline: none;
  }

  main.center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  button {
    border: none;
    background-color: rgb(0, 125, 255);
    padding: 8px;
    border-radius: 8px;
    font-size: 1em;
    color: white;
    transition: all 200ms cubic-bezier(0, 0.97, 0.45, 1.16);
  }

  button:active {
    background-color: rgb(105, 177, 253);
  }
</style>
