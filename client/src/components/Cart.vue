<template>
  <div v-if="cart.length > 0">
    <ul>
      <li v-for="(item, index) in cart" :key="`${item._id}-${index}`">{{ item.name }} - {{ item.price }} USD</li>
    </ul>
    <button @click="placeOrder">Place order</button>
  </div>
  <div v-else>
    <p>Your cart is empty</p>
  </div>
</template>

<script>
export default {
  computed: {
    cart() {
      return this.$store.state.cart;
    },
  },
  methods: {
    async placeOrder() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      this.$store.commit('setCart', []);
      this.$router.push(`/orders/${data._id}`);
    },
  },
};
</script>
