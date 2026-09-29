package com.library.library_management.service;

import com.library.library_management.model.Member;
import com.library.library_management.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Member getMemberById(Long id) {

        return memberRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Member not found: " + id));
    }

    public Member createMember(Member member) {

        if (memberRepository.existsByEmail(member.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        return memberRepository.save(member);
    }

    public Member updateMember(Long id, Member updatedMember) {

        Member member = getMemberById(id);

        member.setName(updatedMember.getName());
        member.setEmail(updatedMember.getEmail());
        member.setPhone(updatedMember.getPhone());

        return memberRepository.save(member);
    }

    public void deleteMember(Long id) {

        if (!memberRepository.existsById(id)) {
            throw new RuntimeException("Member not found: " + id);
        }

        memberRepository.deleteById(id);
    }
}