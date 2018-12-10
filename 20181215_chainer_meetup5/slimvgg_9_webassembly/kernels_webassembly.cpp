
#include <stdlib.h>
#include <math.h>

float static_buffer[7363576];
float* dynamic_buffer = nullptr;

int meta_buf_0[] = {5883776,6034304,50176,3,3,50176};
int meta_buf_1[] = {6034304,4811264,1,3,224,224,112,112,3,3,1,1,2,2,1,1};
int meta_buf_2[] = {4811264,0,6438848,12544,9,27};
int meta_buf_3[] = {243,6438848,6664640,9,9,9,12544,1045220557};
int meta_buf_4[] = {6664640,747008,1,9,112,112,112,112,3,3,1,1,1,1,1,1};
int meta_buf_5[] = {747008,252,5657984,12544,18,81};
int meta_buf_6[] = {5657984,5657984,225792,1045220557};
int meta_buf_7[] = {5657984,3287168,1,18,112,112,56,56,3,3,1,1,2,2,1,1};
int meta_buf_8[] = {3287168,1710,7186784,3136,18,162};
int meta_buf_9[] = {4626,7186784,7186784,18,18,18,3136,1045220557};
int meta_buf_10[] = {7186784,3795200,1,18,56,56,56,56,3,3,1,1,1,1,1,1};
int meta_buf_11[] = {3795200,4644,6551744,3136,36,162};
int meta_buf_12[] = {6551744,6551744,112896,1045220557};
int meta_buf_13[] = {6551744,5149952,1,36,56,56,28,28,3,3,1,1,2,2,1,1};
int meta_buf_14[] = {5149952,10476,7271456,784,36,324};
int meta_buf_15[] = {22140,7271456,7299680,36,36,36,784,1045220557};
int meta_buf_16[] = {7299680,5403968,1,36,28,28,28,28,3,3,1,1,1,1,1,1};
int meta_buf_17[] = {5403968,22176,7073888,784,72,324};
int meta_buf_18[] = {7073888,7073888,56448,1045220557};
int meta_buf_19[] = {7073888,4303232,1,72,28,28,28,28,3,3,1,1,1,1,1,1};
int meta_buf_20[] = {4303232,45504,6960992,784,72,648};
int meta_buf_21[] = {92160,6960992,6960992,72,72,72,784,1045220557};
int meta_buf_22[] = {6960992,2271104,1,72,28,28,28,28,3,3,1,1,1,1,1,1};
int meta_buf_23[] = {2271104,92232,7017440,784,72,648};
int meta_buf_24[] = {7017440,7017440,56448,1045220557};
int meta_buf_25[] = {7017440,2779136,1,72,28,28,28,28,3,3,1,1,1,1,1,1};
int meta_buf_26[] = {2779136,138888,7130336,784,72,648};
int meta_buf_27[] = {185544,7130336,7130336,72,72,72,784,1045220557};
int meta_buf_28[] = {7130336,1763072,1,72,28,28,28,28,3,3,1,1,1,1,1,1};
int meta_buf_29[] = {1763072,185616,6904544,784,72,648};
int meta_buf_30[] = {6904544,6904544,56448,1045220557};
int meta_buf_31[] = {6904544,6311840,1,72,28,28,14,14,3,3,1,1,2,2,1,1};
int meta_buf_32[] = {6311840,232272,7327904,196,72,648};
int meta_buf_33[] = {278928,7327904,7327904,72,72,72,196,1045220557};
int meta_buf_34[] = {7327904,6184832,1,72,14,14,14,14,3,3,1,1,1,1,1,1};
int meta_buf_35[] = {6184832,279000,7243232,196,144,648};
int meta_buf_36[] = {7243232,7243232,28224,1045220557};
int meta_buf_37[] = {7243232,6841040,1,144,14,14,7,7,3,3,1,1,2,2,1,1};
int meta_buf_38[] = {6841040,372312,7349072,49,144,1296};
int meta_buf_39[] = {558936,7349072,7349072,144,144,144,49,1045220557};
int meta_buf_40[] = {7349072,6777536,1,144,7,7,7,7,3,3,1,1,1,1,1,1};
int meta_buf_41[] = {6777536,559080,7342016,49,144,1296};
int meta_buf_42[] = {745704,7342016,7356128,144,144,144,49,1045220557};
int meta_buf_43[] = {7356128,745848,7363184,49,8,144};
int meta_buf_44[] = {747000,7363184,7363184,8,8,8,49};
int* meta_buffers[] = {meta_buf_0,meta_buf_1,meta_buf_2,meta_buf_3,meta_buf_4,meta_buf_5,meta_buf_6,meta_buf_7,meta_buf_8,meta_buf_9,meta_buf_10,meta_buf_11,meta_buf_12,meta_buf_13,meta_buf_14,meta_buf_15,meta_buf_16,meta_buf_17,meta_buf_18,meta_buf_19,meta_buf_20,meta_buf_21,meta_buf_22,meta_buf_23,meta_buf_24,meta_buf_25,meta_buf_26,meta_buf_27,meta_buf_28,meta_buf_29,meta_buf_30,meta_buf_31,meta_buf_32,meta_buf_33,meta_buf_34,meta_buf_35,meta_buf_36,meta_buf_37,meta_buf_38,meta_buf_39,meta_buf_40,meta_buf_41,meta_buf_42,meta_buf_43,meta_buf_44};

extern "C" void init() {
    //static_buffer = (float*)malloc(7363576 * sizeof(float));
}

extern "C" float* get_static_buffer(void) {
    return static_buffer;
}

extern "C" float* allocate_dynamic_buffer(int count) {
    if (dynamic_buffer) {
        free(dynamic_buffer);
        dynamic_buffer = nullptr;
    }
    dynamic_buffer = (float*)malloc(count * sizeof(float));
    return dynamic_buffer;
}

extern "C" float* get_dynamic_buffer(void) {
    return dynamic_buffer;
}
extern "C" void set_placeholder_value(int kernel_order, int offset, int value) {
    meta_buffers[kernel_order][offset] = value;
}

void transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(const int * meta_buffer)
{
    const float * v1 = (static_buffer + meta_buffer[0]);
    float * v2 = (static_buffer + meta_buffer[1]);
    const int v3 = meta_buffer[2];
    const int v4 = meta_buffer[3];
    const int D0 = meta_buffer[4];
    const int D1 = meta_buffer[5];
    int d0;
    for (d0 = ((1 > 8) ? (0 % (1 / 8)) : 0); d0 < D0; d0 += ((1 > 8) ? (1 / 8) : 1)) {
        int d1;
        for (d1 = ((1 > 8) ? (0 / (1 / 8)) : 0); d1 < D1; d1 += ((1 > 8) ? 8 : 1)) {
            const float v5 = v1[d0*v3 + d1];
            float v6;
            {
                v6 = v5;
            }
            v2[d0 + d1*v4] = v6;
        }
    }
}


void im2col_54f86552263d1a348fd988a8122143d1a6ec1c1aa7867ba5833442fb(const int * meta_buffer)
{
    const float *im = (static_buffer + meta_buffer[0]);
    float *col = (static_buffer + meta_buffer[1]);

    const int N = meta_buffer[2];
    const int C1 = meta_buffer[3];
    const int H1 = meta_buffer[4];
    const int W1 = meta_buffer[5];
    const int H2 = meta_buffer[6];
    const int W2 = meta_buffer[7];
    const int KH = meta_buffer[8];
    const int KW = meta_buffer[9];
    const int DH = meta_buffer[10];
    const int DW = meta_buffer[11];
    const int SH = meta_buffer[12];
    const int SW = meta_buffer[13];
    const int PH = meta_buffer[14];
    const int PW = meta_buffer[15];

    for (int gid = 0; gid < N*H2*W2*KH*KW*C1; gid += 1) {
        const int c1 = gid % C1;
        const int kw = gid / C1 % KW;
        const int kh = gid / C1 / KW % KH;
        const int w2 = gid / C1 / KW / KH % W2;
        const int h2 = gid / C1 / KW / KH / W2 % H2;
        const int  n = gid / C1 / KW / KH / W2 / H2;

        const int h1 = h2 * SH - PH + kh * DH;
        const int w1 = w2 * SW - PW + kw * DW;

        col[gid] = (h1 < 0 || h1 >= H1 || w1 < 0 || w1 >= W1) ? 0 : im[((n*H1+h1)*W1+w1)*C1+c1];
    }
}


#ifndef INCLUDE_EIGEN
#define INCLUDE_EIGEN
#include <Eigen/Dense>
#endif

void tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(const int * meta_buffer)
{
    float *A = (static_buffer + meta_buffer[0]);
    float *B = (static_buffer + meta_buffer[1]);
    float *C = (static_buffer + meta_buffer[2]);

    Eigen::Map<Eigen::Matrix<float, Eigen::Dynamic, Eigen::Dynamic, Eigen::RowMajor> > a_mat(A, meta_buffer[3], meta_buffer[5]);
    Eigen::Map<Eigen::Matrix<float, Eigen::Dynamic, Eigen::Dynamic, Eigen::ColMajor> > b_mat(B, meta_buffer[5], meta_buffer[4]);
    Eigen::Map<Eigen::Matrix<float, Eigen::Dynamic, Eigen::Dynamic, Eigen::RowMajor> > c_mat(C, meta_buffer[3], meta_buffer[4]);

    c_mat.noalias() = a_mat * b_mat;
}


void fusedelementwise_7aa3bcd3f1d748cc563d29aadee56048375fb307106692ef072185ef(const int * meta_buffer)
{
    const float * v1 = (static_buffer + meta_buffer[0]);
    const float * v2 = (static_buffer + meta_buffer[1]);
    float * v3 = (static_buffer + meta_buffer[2]);
    const int v4 = meta_buffer[3];
    const int v5 = meta_buffer[4];
    const int D0 = meta_buffer[5];
    const int D1 = meta_buffer[6];
    int d0;
    for (d0 = ((1 > 8) ? (0 % (1 / 8)) : 0); d0 < D0; d0 += ((1 > 8) ? (1 / 8) : 1)) {
        const float v6 = v1[d0];
        int d1;
        for (d1 = ((1 > 8) ? (0 / (1 / 8)) : 0); d1 < D1; d1 += ((1 > 8) ? 8 : 1)) {
            const float v7 = v2[d0 + d1*v4];
            float v8;
            {
                v8 = v7 + v6;
            }
            float v9;
            {
                float slope = *((float *)(&meta_buffer[7]));
                v9 = v8 > 0 ? v8 : (v8 * slope);
            }
            v3[d0 + d1*v5] = v9;
        }
    }
}


void leakyrelu_eba7df8c16191547990325203ef4c5395b3eac15d4e5c56f46be61b2(const int * meta_buffer)
{
    const float * v1 = (static_buffer + meta_buffer[0]);
    float * v2 = (static_buffer + meta_buffer[1]);
    const int D0 = meta_buffer[2];
    int d0;
    for (d0 = 0; d0 < D0; d0 += 1) {
        const float v3 = v1[d0];
        float v4;
        {
            float slope = *((float *)(&meta_buffer[3]));
            v4 = v3 > 0 ? v3 : (v3 * slope);
        }
        v2[d0] = v4;
    }
}


void elementwiseadd_2b50fc92cd4fd19f86f0b848dcf82aad36e4cb2719773776962a15c5(const int * meta_buffer)
{
    const float * v1 = (static_buffer + meta_buffer[0]);
    const float * v2 = (static_buffer + meta_buffer[1]);
    float * v3 = (static_buffer + meta_buffer[2]);
    const int v4 = meta_buffer[3];
    const int v5 = meta_buffer[4];
    const int D0 = meta_buffer[5];
    const int D1 = meta_buffer[6];
    int d0;
    for (d0 = ((1 > 8) ? (0 % (1 / 8)) : 0); d0 < D0; d0 += ((1 > 8) ? (1 / 8) : 1)) {
        const float v6 = v1[d0];
        int d1;
        for (d1 = ((1 > 8) ? (0 / (1 / 8)) : 0); d1 < D1; d1 += ((1 > 8) ? 8 : 1)) {
            const float v7 = v2[d0 + d1*v4];
            float v8;
            {
                v8 = v7 + v6;
            }
            v3[d0 + d1*v5] = v8;
        }
    }
}

extern "C" void run() {
transpose_3ede431373fd6b14a21ca5a7f2fab289eb4c42220e346f22acc816e8(meta_buf_0);
im2col_54f86552263d1a348fd988a8122143d1a6ec1c1aa7867ba5833442fb(meta_buf_1);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_2);
fusedelementwise_7aa3bcd3f1d748cc563d29aadee56048375fb307106692ef072185ef(meta_buf_3);
im2col_54f86552263d1a348fd988a8122143d1a6ec1c1aa7867ba5833442fb(meta_buf_4);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_5);
leakyrelu_eba7df8c16191547990325203ef4c5395b3eac15d4e5c56f46be61b2(meta_buf_6);
im2col_54f86552263d1a348fd988a8122143d1a6ec1c1aa7867ba5833442fb(meta_buf_7);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_8);
fusedelementwise_7aa3bcd3f1d748cc563d29aadee56048375fb307106692ef072185ef(meta_buf_9);
im2col_54f86552263d1a348fd988a8122143d1a6ec1c1aa7867ba5833442fb(meta_buf_10);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_11);
leakyrelu_eba7df8c16191547990325203ef4c5395b3eac15d4e5c56f46be61b2(meta_buf_12);
im2col_54f86552263d1a348fd988a8122143d1a6ec1c1aa7867ba5833442fb(meta_buf_13);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_14);
fusedelementwise_7aa3bcd3f1d748cc563d29aadee56048375fb307106692ef072185ef(meta_buf_15);
im2col_54f86552263d1a348fd988a8122143d1a6ec1c1aa7867ba5833442fb(meta_buf_16);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_17);
leakyrelu_eba7df8c16191547990325203ef4c5395b3eac15d4e5c56f46be61b2(meta_buf_18);
im2col_54f86552263d1a348fd988a8122143d1a6ec1c1aa7867ba5833442fb(meta_buf_19);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_20);
fusedelementwise_7aa3bcd3f1d748cc563d29aadee56048375fb307106692ef072185ef(meta_buf_21);
im2col_54f86552263d1a348fd988a8122143d1a6ec1c1aa7867ba5833442fb(meta_buf_22);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_23);
leakyrelu_eba7df8c16191547990325203ef4c5395b3eac15d4e5c56f46be61b2(meta_buf_24);
im2col_54f86552263d1a348fd988a8122143d1a6ec1c1aa7867ba5833442fb(meta_buf_25);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_26);
fusedelementwise_7aa3bcd3f1d748cc563d29aadee56048375fb307106692ef072185ef(meta_buf_27);
im2col_54f86552263d1a348fd988a8122143d1a6ec1c1aa7867ba5833442fb(meta_buf_28);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_29);
leakyrelu_eba7df8c16191547990325203ef4c5395b3eac15d4e5c56f46be61b2(meta_buf_30);
im2col_54f86552263d1a348fd988a8122143d1a6ec1c1aa7867ba5833442fb(meta_buf_31);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_32);
fusedelementwise_7aa3bcd3f1d748cc563d29aadee56048375fb307106692ef072185ef(meta_buf_33);
im2col_54f86552263d1a348fd988a8122143d1a6ec1c1aa7867ba5833442fb(meta_buf_34);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_35);
leakyrelu_eba7df8c16191547990325203ef4c5395b3eac15d4e5c56f46be61b2(meta_buf_36);
im2col_54f86552263d1a348fd988a8122143d1a6ec1c1aa7867ba5833442fb(meta_buf_37);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_38);
fusedelementwise_7aa3bcd3f1d748cc563d29aadee56048375fb307106692ef072185ef(meta_buf_39);
im2col_54f86552263d1a348fd988a8122143d1a6ec1c1aa7867ba5833442fb(meta_buf_40);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_41);
fusedelementwise_7aa3bcd3f1d748cc563d29aadee56048375fb307106692ef072185ef(meta_buf_42);
tensordot_b0c87b9ad9c24d5c638538a68fd9e1ad2b472c70c0e98883fad5c6af(meta_buf_43);
elementwiseadd_2b50fc92cd4fd19f86f0b848dcf82aad36e4cb2719773776962a15c5(meta_buf_44);

}

